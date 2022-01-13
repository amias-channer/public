import Icon from 'frontend-core/dist/components/ui-trader4/icon/index';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import deactivateActiveElement from 'frontend-core/dist/platform/deactivate-active-element';
import isUserInEarlyAdoptersProgram from 'frontend-core/dist/services/app-version-settings/is-user-in-early-adopters-program';
import isUserOnNextAppVersion from 'frontend-core/dist/services/app-version-settings/is-user-on-next-app-version';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {Unsubscribe} from '../../event-broker/subscription';
import {AppApiContext, ConfigContext, I18nContext, MainClientContext} from '../app-component/app-context';
import getAppWorkspace from '../app-component/get-app-workspace';
import Button, {ButtonSizes, ButtonVariants} from '../button';
import {selectableButtonWithBackdrop} from '../button/button.css';
import {backdrop, buttons, content} from '../modal/modal.css';
import {ProductTourSettings} from './loader';
import {
    activeProgressBarItem,
    compactLayoutPopup,
    focusedElement,
    focusedElementRoot,
    fullLayoutPopup,
    header,
    nextStepButton,
    popupArrow,
    prevStepButton,
    stepsBar,
    stepsBarItem
} from './product-tour.css';
import {ProductTourSteps} from './state-helpers/steps';
import AccountSummaryStep from './steps/account-summary-step';
import ActivityStep from './steps/activity-step';
import CashOrderStep from './steps/cash-order-step';
import ProductsSearchStep from './steps/products-search-step';
import QuickOrderStep from './steps/quick-order-step';
import getElementToClick from './view-helpers/get-element-to-click';
import getElementToFocus from './view-helpers/get-element-to-focus';
import schedulePopupPositionCalculation from './view-helpers/schedule-popup-position-calculation';
import showBetaVersionSalutation from './view-helpers/show-beta-version-salutation';
import showProductTourSalutation from './view-helpers/show-product-tour-salutation';

export interface StepProps {
    showImg: boolean;
}

interface Props {
    compact: boolean;
    isStarted: boolean;
    settings: ProductTourSettings;
    onStart(): void;
    onSettingsChange(settings: Partial<ProductTourSettings>): void;
    onEnd(): void;
}

const {useState, useRef, useCallback, useLayoutEffect, useContext} = React;
const stepComponents: Record<ProductTourSteps, typeof AccountSummaryStep> = {
    [ProductTourSteps.ACCOUNT_SUMMARY]: AccountSummaryStep,
    [ProductTourSteps.ACTIVITY]: ActivityStep,
    [ProductTourSteps.CASH_ORDER]: CashOrderStep,
    [ProductTourSteps.PRODUCTS_SEARCH]: ProductsSearchStep,
    [ProductTourSteps.QUICK_ORDER]: QuickOrderStep
};
const getProductTourSteps = (isCompact: boolean): [ProductTourSteps, ...ProductTourSteps[]] => {
    return isCompact
        ? [
              ProductTourSteps.PRODUCTS_SEARCH,
              ProductTourSteps.QUICK_ORDER,
              ProductTourSteps.ACTIVITY,
              ProductTourSteps.ACCOUNT_SUMMARY
          ]
        : [
              ProductTourSteps.CASH_ORDER,
              ProductTourSteps.PRODUCTS_SEARCH,
              ProductTourSteps.QUICK_ORDER,
              ProductTourSteps.ACTIVITY,
              ProductTourSteps.ACCOUNT_SUMMARY
          ];
};
const ProductTour: React.FunctionComponent<Props> = ({
    compact,
    isStarted,
    settings,
    onSettingsChange,
    onStart,
    onEnd
}) => {
    const app = useContext(AppApiContext);
    const config = useContext(ConfigContext);
    const mainClient = useContext(MainClientContext);
    const i18n = useContext(I18nContext);
    const layoutElRef = useRef<HTMLDivElement | null>(null);
    const popupPositionCalculationCancelRef = useRef<Unsubscribe | null>(null);
    const [steps, setSteps] = useState<[ProductTourSteps, ...ProductTourSteps[]]>(() => getProductTourSteps(compact));
    const [step, setStep] = useState<ProductTourSteps>(steps[0]);
    const currentStepIndex: number = steps.indexOf(step);
    const resetStepElementsStyle = () => {
        popupPositionCalculationCancelRef.current?.();
        // clean links to previous function scope
        popupPositionCalculationCancelRef.current = null;

        const stepFocusedEl = document.querySelector(`.${focusedElement}`);

        // reset styles
        stepFocusedEl?.classList.remove(focusedElement);
        document.querySelectorAll(`.${focusedElementRoot}`).forEach((el) => {
            el.classList.remove(focusedElementRoot);
        });
    };
    const dismiss = useCallback(() => {
        resetStepElementsStyle();
        onEnd();
    }, [onEnd]);
    const goToStep = (step: ProductTourSteps) => {
        // reset focus
        deactivateActiveElement();
        setStep(step);
    };

    useLayoutEffect(() => {
        const checkSettings = () => {
            const showCommonSalutation = () => {
                if (settings.hasSeenProductTour) {
                    return;
                }

                showProductTourSalutation({app, i18n, onContinue: onStart});
                onSettingsChange({hasSeenProductTour: true});
            };

            if (
                !settings.hasSeenBetaSalutation &&
                isUserOnNextAppVersion(config) &&
                isUserInEarlyAdoptersProgram(mainClient)
            ) {
                showBetaVersionSalutation({
                    app,
                    i18n,
                    onContinue: showCommonSalutation
                });
                onSettingsChange({hasSeenBetaSalutation: true});
            } else {
                showCommonSalutation();
            }
        };
        const onGlobalKeyUp = ({key}: KeyboardEvent) => {
            if (key === 'Escape') {
                dismiss();
            }
        };

        if (!isStarted) {
            checkSettings();
        }

        document.addEventListener('keyup', onGlobalKeyUp, false);

        return () => {
            document.removeEventListener('keyup', onGlobalKeyUp, false);
            resetStepElementsStyle();
        };
    }, []);

    useLayoutEffect(() => {
        const steps = getProductTourSteps(compact);

        setSteps(steps);
        setStep(steps[0]);
    }, [compact]);

    useLayoutEffect(() => {
        // after switch between layouts 'step' might change, but check if product tour is started
        if (!isStarted) {
            return;
        }

        const setStepElementFocus = (layoutEl: HTMLElement, stepElement: HTMLElement) => {
            const appWorkspace: HTMLElement | null = getAppWorkspace();
            const popup: HTMLElement | null = layoutEl.querySelector<HTMLElement>('[data-name="popup"]');
            const popupArrow: HTMLElement | null = layoutEl.querySelector<HTMLElement>('[data-name="popupArrow"]');

            if (!popup || !popupArrow || !appWorkspace) {
                return;
            }

            popupPositionCalculationCancelRef.current = schedulePopupPositionCalculation(
                popup,
                popupArrow,
                appWorkspace,
                stepElement
            );
        };
        const setStepElementsStyle = () => {
            resetStepElementsStyle();
            const {current: layoutEl} = layoutElRef;
            const elementToFocus: HTMLElement | null = getElementToFocus(step, {compact});
            const elementToClick: HTMLElement | null = getElementToClick(elementToFocus);

            if (!layoutEl || !elementToFocus) {
                logErrorLocally('Product tour step element not found', {step, elementToFocus});
                dismiss();
                return;
            }

            elementToClick?.click();

            // set classname for the "root" of each focused element
            document
                .querySelectorAll<HTMLElement>(
                    compact ? '[data-name="bottomNavigation"]' : '[data-name="fullHeader"],[data-name="sideNavigation"]'
                )
                .forEach((el) => el.classList.add(focusedElementRoot));

            setStepElementFocus(layoutEl, elementToFocus);
        };

        setStepElementsStyle();
    }, [isStarted, step]);

    if (!isStarted) {
        return null;
    }

    const prevStep: ProductTourSteps | undefined = steps[currentStepIndex - 1];
    const nextStep: ProductTourSteps | undefined = steps[currentStepIndex + 1];
    const StepComponent = stepComponents[step];

    return (
        <div className={backdrop} ref={layoutElRef}>
            <div className={compact ? compactLayoutPopup : fullLayoutPopup} data-name="popup">
                <div className={popupArrow} data-name="popupArrow" />
                <div className={header}>
                    <div className={stepsBar}>
                        {steps.map((step: ProductTourSteps, index: number) => {
                            const isActiveStep: boolean = currentStepIndex >= index;
                            const isCurrentStep: boolean = currentStepIndex === index;

                            return (
                                <button
                                    key={step}
                                    data-id={step}
                                    data-active={isActiveStep}
                                    type="button"
                                    onClick={isCurrentStep ? undefined : goToStep.bind(null, step)}
                                    className={isActiveStep ? activeProgressBarItem : stepsBarItem}
                                />
                            );
                        })}
                    </div>
                    <button
                        type="button"
                        onClick={dismiss}
                        className={selectableButtonWithBackdrop}
                        aria-label={localize(i18n, 'trader.productTour.skipAction')}>
                        <Icon type="close" />
                    </button>
                </div>
                <div className={content}>{StepComponent && <StepComponent showImg={!compact} />}</div>
                <div className={buttons}>
                    {prevStep && (
                        <button
                            type="button"
                            data-name="prevStepButton"
                            className={prevStepButton}
                            onClick={goToStep.bind(null, prevStep)}>
                            {localize(i18n, 'trader.productTour.previousStep')}
                        </button>
                    )}
                    {nextStep ? (
                        <Button
                            variant={ButtonVariants.ACCENT}
                            size={ButtonSizes.LARGE}
                            data-name="nextStepButton"
                            onClick={goToStep.bind(null, nextStep)}
                            className={nextStepButton}>
                            {localize(i18n, 'trader.productTour.nextStep')}
                        </Button>
                    ) : (
                        <Button
                            variant={ButtonVariants.ACCENT}
                            size={ButtonSizes.LARGE}
                            data-name="dismissButton"
                            onClick={dismiss}
                            className={nextStepButton}>
                            {localize(i18n, 'trader.productTour.dismissAction')}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default React.memo(ProductTour);
