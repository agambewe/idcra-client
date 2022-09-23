// @flow
import React from 'react';

export default class HomePage extends React.Component<{}> {
  render = () => (
    <div style={{justifyContent: 'center', display: 'flex'}}>
      <img src={require('./logo-idcra-vol-2.png')} />
    </div>
  );
}
