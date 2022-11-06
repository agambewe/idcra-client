// @flow
import React from 'react';
import cookie from 'js-cookie';
import ParentHasStudentQuery from '../../Queries/ParentHasStudentQuery';

export default class HomePage extends React.Component<{}> {
  render = () => (
    <ParentHasStudentQuery query={ ParentHasStudentQuery.query } variables={ { email: cookie.get('email') } }>
      { ({ data: parentHasStudentData, loading: parentHasStudentLoading, refetch: refetchParentHasStudent }) => {
        if (parentHasStudentData.user && parentHasStudentData.user.students.length) {
          cookie.set('studentId', parentHasStudentData.user.students[0].id, { expires: 7 });
        }
        return (
          <div style={ { justifyContent: 'center', display: 'flex' } }>
            <img
              style={ {
                width: '100%',
                maxWidth: '600px',
                height: 'auto',
                borderRadius: '4px',
              } }
              src={ require('./logo-idcra-vol-2.png') } alt={ 'logo' } />
          </div>
        )
      } }
    </ParentHasStudentQuery>
  );
}
