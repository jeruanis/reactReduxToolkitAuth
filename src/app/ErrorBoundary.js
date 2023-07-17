import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
  }


  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
    this.setState({ hasError: true });
  }

  // componentDidMount() {
  //   window.onerror = (message, source, lineno, colno, error) => {
  //     console.error(error);
  //     this.setState({ hasError: true });
  //   };
  // }

 
  render() {
    if (this.state.hasError) {
      return (
        <div className="full-page-container">
          <div className="centered-content">
            <div>Something went wrong. Please try again later.</div>
          </div>
        </div>
        )
    // return this.props.fallback;
    }
    //render this fallback when there is an error
    return this.props.children;
  }
}

export default ErrorBoundary;
