import styled from 'styled-components'

export const Link = styled.a`
  color: #000000;
  display: block;
  text-decoration: none;
  padding: 1rem 2rem;

  &:hover {
    background: rgba(223, 226, 230, 0.5);
  }
`
export const SmartFAQContainer = styled.div`
  background: #f3f4f5;
  font-family: 'Basier Circle';
  padding-bottom: 2rem;
`

export const Header = styled.div`
  color: #8b959e;
  margin-bottom: 1rem;
  font-size: 15px;
  line-height: 20px;
  letter-spacing: -0.02em;
  padding-left: 2rem;
  padding-top: 2rem;
`

export const HelpCentreContainer = styled.div`
  height: 100%;
  overflow-y: scroll;
`

export const LoaderContainer = styled.div`
  position: relative;
  height: 100px;
  margin-top: 50px;
`
