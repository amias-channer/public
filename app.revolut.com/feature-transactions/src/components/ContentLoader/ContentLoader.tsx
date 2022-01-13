import { Flex, Loader } from '@revolut/ui-kit'

export const ContentLoader = () => (
  <Flex
    alignItems="center"
    justifyContent="center"
    mt="7rem"
    data-testid="transactions-loader"
  >
    <Loader />
  </Flex>
)
