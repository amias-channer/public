import React from 'react'
import { Redirect, Route } from 'react-router'
import { connect } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { FormsApi } from 'revolut-forms'

import { ContentWrapper, SupportChatWrapper, Content } from '../components'
import { history } from '../redux/stores/history'
import { ResolvedAndRated } from '../components/Survey/ResolvedAndRated'
import { FullHeightPages, TabsEnum } from '../constants/routerPaths'
import { ChatHeaderProvider } from '../providers'
import { DispatchAnalyticsEventOnMount } from '../helpers/DispatchAnalyticsEventOnMount'

import { HelpCentre } from './HelpCentre'
import { SwitchScreensAnimation } from './Animation'

import { Chat, Tickets, Header, Signin, Banners, Form } from './index'
import { AccessRecovery } from './AccessRecovery'
import { Dexter } from './Dexter'
import { DexterSuggestion, TroubleshootSuggestion } from '../api/types'

export const TEST_ID_CHAT_WRAPPER = 'TEST_ID_CHAT_WRAPPER'

type OwnProps = {
  isOpen: boolean
  isHelpExcluded: boolean
  faqRanks?: any
  helpcentrePath: string
  formsAPI: FormsApi
  fetchPrechatSuggestion?: (query: string) => Promise<DexterSuggestion>
  fetchTroubleshootSuggestions?: () => Promise<string[]>
  prechatTroubleshoots?: TroubleshootSuggestion[]
  closeChat: () => void
}

type MapStateToProps = {
  auth: {
    clientId: string
  }
}

type Props = OwnProps & MapStateToProps

const mapStateToProps = (state: any) => ({
  auth: state.auth,
})

const enhance = connect<MapStateToProps>(mapStateToProps)
export class WidgetClass extends React.Component<Props> {
  componentDidMount() {
    this.alignActiveUrlOnMount()
  }

  componentDidUpdate(prevProps: Props) {
    const { isHelpExcluded } = this.props
    if (prevProps.isHelpExcluded !== isHelpExcluded) {
      this.alignActiveUrlOnUpdate()
    }
  }

  alignActiveUrlOnMount() {
    const { isHelpExcluded } = this.props
    history.replace(isHelpExcluded ? TabsEnum.CHAT : TabsEnum.HELP)
  }

  alignActiveUrlOnUpdate() {
    const { isHelpExcluded } = this.props

    if (history.location.pathname === TabsEnum.HELP && isHelpExcluded) {
      history.replace(TabsEnum.CHAT)
    }
  }

  render() {
    const {
      auth,
      isHelpExcluded,
      faqRanks,
      helpcentrePath,
      formsAPI,
      fetchTroubleshootSuggestions,
      fetchPrechatSuggestion,
      closeChat,
    } = this.props
    const isAuthorized = auth.clientId
    return (
      <SupportChatWrapper data-testid={TEST_ID_CHAT_WRAPPER}>
        <ConnectedRouter history={history}>
          <ContentWrapper>
            <ChatHeaderProvider>
              <Header isHelpExcluded={isHelpExcluded} />
              <Content>
                {!isAuthorized && (
                  <Route
                    path={`${TabsEnum.CHAT}/:id`}
                    component={() => (
                      <Redirect
                        from={`${TabsEnum.CHAT}/:id`}
                        to={TabsEnum.CHAT}
                      />
                    )}
                  />
                )}
                <SwitchScreensAnimation>
                  <Route
                    path={TabsEnum.HELP}
                    render={(props) => (
                      <HelpCentre {...props} faqRanks={faqRanks} />
                    )}
                  />
                  <Route
                    path={FullHeightPages.SURVEY_COMPLETED}
                    component={ResolvedAndRated}
                  />
                  {isAuthorized && (
                    <Route
                      path={`${TabsEnum.CHAT}/:id`}
                      render={(props) => (
                        <Chat
                          {...props}
                          closeChat={closeChat}
                          helpcentrePath={helpcentrePath}
                          fetchTroubleshootSuggestions={
                            fetchTroubleshootSuggestions
                          }
                        />
                      )}
                    />
                  )}
                  <Route
                    exact
                    path={TabsEnum.CHAT}
                    component={isAuthorized ? Tickets : Signin}
                  />
                  <Route
                    exact
                    path={`${TabsEnum.FORM}/:formId`}
                    render={(props) => (
                      <Form
                        {...props}
                        closeChat={closeChat}
                        formsAPI={formsAPI}
                      />
                    )}
                  />
                  <Route
                    exact
                    path={`${TabsEnum.ACCESS_RECOVERY}`}
                    component={AccessRecovery}
                  />
                  {fetchPrechatSuggestion && (
                    <Route
                      exact
                      path={`${TabsEnum.DEXTER}`}
                      component={(props: any) => (
                        <Dexter
                          {...props}
                          closeChat={closeChat}
                          fetchPrechatSuggestion={fetchPrechatSuggestion}
                        />
                      )}
                    />
                  )}
                </SwitchScreensAnimation>
              </Content>
              <Route
                exact
                path={TabsEnum.CHAT}
                render={() => (
                  <>
                    <Banners />
                    {/* Firing this event in scope of the SwitchScreensAnimation leads to double requests. It's a known issue with react-transition-group */}
                    {isAuthorized && (
                      <DispatchAnalyticsEventOnMount
                        event={{ type: 'Chat list' }}
                      />
                    )}
                  </>
                )}
              />
            </ChatHeaderProvider>
          </ContentWrapper>
        </ConnectedRouter>
      </SupportChatWrapper>
    )
  }
}

export const Widget = enhance(WidgetClass)
