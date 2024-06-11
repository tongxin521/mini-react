import React from "./lib/react/React";

export default class AppClass extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            // eslint-disable-next-line react/prop-types
            <div className="container" id={this.props.id}>
              <div className="one">
                <div className="two">
                  <p>1</p>
                  <p>2</p>
                </div>
                <div className="three">
                  <p>3</p>
                  <p>4</p>
                </div>
              </div>
              <p>this is a tes1</p>
            </div>
        );
    }
}