import React, { Component, PropTypes } from 'react'; 
import { bindActionCreators } from 'redux'; 
import { connect } from 'react-redux'; 
// import Header from '../components/Header'; 
// import MainSection from '../components/MainSection'; 
// import * as TodoActions from '../actions/todos'; 

class App extends Component { 
  render() { 
      const { todos, actions } = this.props; 
        return ( 
          <div>
            test
          </div>
        ); 
    }
} 

// App.propTypes = { 
//   todos: PropTypes.array.isRequired,
//   actions: PropTypes.object.isRequired 
// }; 

// function mapStateToProps(state) { 
//   return {
//     todos: state.todos
//   }; 
// } 

// function mapDispatchToProps(dispatch) {
//   return { 
//     actions: bindActionCreators(TodoActions, dispatch) 
//   };
// } 

// export default connect( 
//   mapStateToProps, 
//   mapDispatchToProps 
// )(App);
export default App;