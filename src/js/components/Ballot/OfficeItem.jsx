import React, { Component, PropTypes } from "react";
import { Link, browserHistory } from "react-router";
import ItemPositionStatementActionBar from "../../components/Widgets/ItemPositionStatementActionBar";
import StarAction from "../../components/Widgets/StarAction";
import SupportStore from "../../stores/SupportStore";
import { capitalizeString } from "../../utils/textFormat";

export default class OfficeItem extends Component {
  static propTypes = {
    key: PropTypes.string,
    we_vote_id: PropTypes.string.isRequired,
    kind_of_ballot_item: PropTypes.string.isRequired,
    ballot_item_display_name: PropTypes.string.isRequired,
    link_to_ballot_item_page: PropTypes.bool
  };
  constructor (props) {
    super(props);
    this.state = {transitioning: false};
  }

  componentDidMount () {
    this.supportStoreListener = SupportStore.addListener(this._onChange.bind(this));
    this.setState({ supportProps: SupportStore.get(this.props.we_vote_id) });
  }

  componentWillUnmount () {
    this.supportStoreListener.remove();
  }

  _onChange () {
    this.setState({ supportProps: SupportStore.get(this.props.we_vote_id), transitioning: false });
  }
  render () {
    console.log("OfficeItem this.props:", this.props);
    const { supportProps, transitioning } = this.state;
    let { ballot_item_display_name, we_vote_id } = this.props;
    let officeLink = "/office/" + we_vote_id;
    let goToOfficeLink = function () { browserHistory.push(officeLink); };

    ballot_item_display_name = capitalizeString(ballot_item_display_name);
    let candidates_html = <span></span>;  // For a preview of the candidates

    return <div className="office-card">
        <div className="office-card__media-object">
          <div className="office-card__media-object-anchor">

          </div>
          <div className="office-card__media-object-content">
            <h2 className="office-card__display-name">
              { this.props.link_to_ballot_item_page ?
                <Link to={officeLink}>{ballot_item_display_name}</Link> :
                  ballot_item_display_name
              }
            </h2>
            <StarAction we_vote_id={we_vote_id} type="OFFICE"/>

            <div className={ this.props.link_to_ballot_item_page ?
                    "cursor-pointer" : null }
                  onClick={ this.props.link_to_ballot_item_page ?
                    goToOfficeLink : null }>{candidates_html}</div>

            <div className="row" style={{ paddingBottom: "0.5rem" }}>
              <div className="col-xs-12">
              </div>
            </div>
              </div> {/* END .office-card__media-object-content */}
            </div> {/* END .office-card__media-object */}
            <div className="office-card__actions">
              <ItemPositionStatementActionBar ballot_item_we_vote_id={we_vote_id}
                                              ballot_item_display_name={ballot_item_display_name}
                                              supportProps={supportProps}
                                              transitioniing={transitioning}
                                              type="OFFICE" />
          </div>
        </div>;
      }
    }
