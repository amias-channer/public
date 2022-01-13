export const MARKET_MEMBERS_FETCH_CONTENT = 'MarketMembers/MARKET_MEMBERS_FETCH_CONTENT';
export const MARKET_MEMBERS_GOT_CONTENT = 'MarketMembers/MARKET_MEMBERS_GOT_CONTENT';
export const MARKET_MEMBERS_WILL_UNMOUNT = 'MarketMembers/MARKET_MEMBERS_WILL_UNMOUNT';

export function marketMembersFetchContent() {
  return {
    type: MARKET_MEMBERS_FETCH_CONTENT,
  };
}

export function marketMembersGotContent(data) {
  return {
    type: MARKET_MEMBERS_GOT_CONTENT,
    data,
  };
}
export function marketMembersWillUnmount() {
  return {
    type: MARKET_MEMBERS_WILL_UNMOUNT,
  };
}
