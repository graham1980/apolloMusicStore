import { gql } from 'apollo-boost';

export const GET_QUEUED_SONGS = gql`
    query getQueuedSongs {
        queue @client {
            id
            duration
            title
            artist
            thumbnail
            url
        }
    }
`

export const GET_SONGS = gql`
    query getSongs {
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