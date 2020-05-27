import { gql } from "apollo-boost";

export const GET_SONGS = gql`
    subscription getSongs {
        songs(order_by: {created: desc}) {
        artist
        created
        duration
        id
        thumbnail
        title
        url
        }
    }
`