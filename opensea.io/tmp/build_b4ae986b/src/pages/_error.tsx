import React from "react"
import { NextPageContext } from "next"
import { RRNLRequestError } from "react-relay-network-modern"
import { ErrorPage, ErrorPageProps } from "../components/pages/ErrorPage"
import { getGraphQLResponseErrors } from "../lib/graphql/error"

const Error = ({ statusCode }: ErrorPageProps) => {
  return <ErrorPage statusCode={statusCode} />
}

const getStatusCodeFromErrror = (
  error: NextPageContext["err"],
): number | undefined => {
  if (!error) {
    return undefined
  }

  if (error instanceof RRNLRequestError) {
    const graphqlErrors = getGraphQLResponseErrors(error)
    const maybeErrorWithStatus = graphqlErrors.find(r => Boolean(r.status))
    return maybeErrorWithStatus?.status
  }

  return error.statusCode
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = getStatusCodeFromErrror(err) ?? res?.statusCode ?? 404
  return { statusCode }
}

export default Error
