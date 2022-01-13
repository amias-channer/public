import InnerHtml from 'frontend-core/dist/components/ui-common/inner-html';
import {I18n} from 'frontend-core/dist/models/i18n';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import productBetaImgUrl from '../../../../images/svg/product-beta.svg';
import {AppComponentApi} from '../../app-component';
import Button, {ButtonSizes, ButtonVariants} from '../../button';
import {ModalSizes} from '../../modal';
import {buttons, cancelButton, confirmButton} from '../../modal/modal.css';
import {salutationModalContent, salutationModalImg} from '../product-tour.css';

interface Props {
    app: AppComponentApi;
    i18n: I18n;
    onContinue(): void;
}

export default function showProductTourSalutation({app, i18n, onContinue}: Props) {
    app.openModal({
        size: ModalSizes.MEDIUM,
        title: localize(i18n, 'trader.productTour.salutation.title'),
        content: (
            <>
                <img className={salutationModalImg} src={productBetaImgUrl} alt="" />
                <InnerHtml className={salutationModalContent}>
                    {localize(i18n, 'trader.productTour.salutation.description')}
                </InnerHtml>
            </>
        ),
        footer: (
            <div className={buttons}>
                <button
                    type="button"
                    data-name="productTourSkipButton"
                    onClick={app.closeModal}
                    className={cancelButton}>
                    {localize(i18n, 'trader.productTour.skipAction')}
                </button>
                <Button
                    size={ButtonSizes.LARGE}
                    variant={ButtonVariants.ACCENT}
                    data-name="productTourStartButton"
                    className={confirmButton}
                    // eslint-disable-next-line react/jsx-no-bind
                    onClick={() => {
                        app.closeModal();
                        onContinue();
                    }}>
                    {localize(i18n, 'trader.productTour.startAction')}
                </Button>
            </div>
        )
    });
}
