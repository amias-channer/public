import React from "react"
import ky from "ky-universal"
import { useQuery } from "react-query"
import styled, { css } from "styled-components"
import Flex from "../../../design-system/Flex"
import Text from "../../../design-system/Text"
import CarouselCard from "../../common/CarouselCard.react"
import ContainedCarousel from "../../common/ContainedCarousel"
import { sizeMQ } from "../../common/MediaQuery.react"

type BlogPost = {
  title: { rendered: string }
  link: string
  jetpack_featured_media_url: string
}

type Post = {
  title: string
  link: string
  image: string
}

const FromBlog = () => {
  const { data } = useQuery("posts", () => getBlogPosts())
  if (!data) {
    return null
  }

  return (
    <Container>
      <Flex className="FromBlog--main">
        <Text as="h2" className="FromBlog--title" variant="h3">
          Resources for getting started
        </Text>
        <ContainedCarousel>
          {data.map((post: Post) => (
            <CarouselCard
              className="FromBlog--card"
              containerClassName="FromBlog--card-container"
              href={post.link}
              imageHeight={265}
              imageUrl={post.image}
              key={post.link}
            >
              <Text
                as="div"
                className="FromBlog--card-title"
                dangerouslySetInnerHTML={{ __html: post.title }}
                variant="h4"
              />
            </CarouselCard>
          ))}
        </ContainedCarousel>
      </Flex>
    </Container>
  )
}

export default FromBlog

const Container = styled(Flex).attrs({ as: "section" })`
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
  margin-bottom: 120px;

  .FromBlog--main {
    flex-direction: column;
    align-items: center;
    width: 100%;

    .FromBlog--title {
      margin-bottom: 48px;
      text-align: center;
    }

    .Carousel--left-arrow {
      left: -8px;
      top: 247px;
    }

    .Carousel--right-arrow {
      right: -19px;
      top: 247px;
    }

    .FromBlog--card-container {
      padding: 0;

      ${sizeMQ({
        small: css`
          padding: 2%;
          margin: 0 10px;
        `,
        medium: css`
          padding: 1.3%;
        `,
      })}
    }

    .FromBlog--card {
      ${sizeMQ({
        small: css`
          width: 98%;
        `,
      })}
    }

    .FromBlog--card-title {
      color: ${props => props.theme.colors.text.body};
      font-weight: 600;
      font-size: 16px;
      margin: 10px 20px 10px 16px;
      height: 50px;
      overflow: hidden;
      /* Allow only two lines of text  */
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
`

const getBlogPosts = () => {
  return ky
    .get(
      "https://opensea.io/blog/wp-json/wp/v2/posts?_fields=title,jetpack_featured_media_url,link&categories[]=86&per_page=6&order_date",
    )
    .json<BlogPost[]>()
    .then((posts: BlogPost[]) =>
      posts.map((post: BlogPost) => ({
        title: post.title.rendered,
        link: post.link,
        image: post.jetpack_featured_media_url,
      })),
    )
}
