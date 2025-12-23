import React from 'react'
type Props = Record<string, never>;

type State = {
  count: number;
};
class ClassCompo extends React.Component<Props, State> {
    
    constructor(props:Props){
        super(props)
        this.state = {
            count:0
        };
    }
    
    render(){
    return (
      <>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </>
    )
  }
}
export default ClassCompo;