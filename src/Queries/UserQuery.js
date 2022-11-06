// @flow
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import User from '../Fragments/User';

export default class UserQuery extends Query<*, *> {
  static query = gql`
    query user($email: String!) {
      user(email: $email) {
        ...User
      }
    }
    ${User}
  `;
}
