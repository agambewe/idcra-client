// @flow
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

export default class ParentHasStudentMutation extends Mutation<*, *> {
  static mutation = gql`
    mutation parentHasStudent($userId: String!, $studentId: String!) {
      parentHasStudent(userId: $userId, studentId: $studentId) {
        id
        students {
          id
        }
      }
    }
  `;
}
