// @flow
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

export default class ParentHasStudentQuery extends Query<*, *> {
  static query = gql`
    query user($email: String!) {
      user(email: $email) {
        id
        students{
          id
        }
      }
    }
  `;
}
