import React, { Component, PropTypes } from "react";
// import CandidateActions from "../../actions/CandidateActions";
// import CandidateItem from "../../components/Ballot/CandidateItem";
// import BallotStore from "../../stores/BallotStore";
import CandidateList from "../../components/Ballot/CandidateList";
// import CandidateStore from "../../stores/CandidateStore";
import GuideList from "../../components/VoterGuide/GuideList";
import GuideStore from "../../stores/GuideStore";
import OfficeActions from "../../actions/OfficeActions";
import OfficeItem from "../../components/Ballot/OfficeItem";
import OfficeStore from "../../stores/OfficeStore";
// import PositionList from "../../components/Ballot/PositionList";
// import ThisIsMeAction from "../../components/Widgets/ThisIsMeAction";
import VoterStore from "../../stores/VoterStore";
import { exitSearch } from "../../utils/search-functions";

// TODO DALE Convert to work for an Office
export default class Office extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    this.state = {candidate: {}, office: {}, office_we_vote_id: this.props.params.office_we_vote_id };
  }

  componentDidMount (){
    this.officeStoreListener = OfficeStore.addListener(this._onOfficeStoreChange.bind(this));
    let office = OfficeStore.get(this.state.office_we_vote_id) || {};
    if ( office === {} ) {
      OfficeActions.retrieve(this.state.office_we_vote_id);
    }
    exitSearch("");
  }

  componentWillUnmount () {
    // this.candidateStoreListener.remove();
    this.officeStoreListener.remove();

  }

  _onOfficeStoreChange (){
    console.log("Office this.state.office_we_vote_id:", this.state.office_we_vote_id);
    let office = OfficeStore.get(this.state.office_we_vote_id) || {};

    this.setState({ office: office, guideToFollowList: GuideStore.toFollowListForBallotItem() });

  }

  render () {
    const electionId = VoterStore.election_id();
    const NO_VOTER_GUIDES_TEXT = "We could not find any more voter guides to follow about this office.";
    var { office, guideToFollowList } = this.state;


    if (!office.ballot_item_display_name){
      return <div className="container-fluid well u-gutter-top--small fluff-full1">
              <h3>This Office Not Found</h3>
        NOTE: The We Vote team is still building support for Offices.
                <div className="small">We were not able to find that office.
                  Please search again.</div>
                <br />
            </div>;
    }
    return <span>
        <section className="office-card__container">
          <OfficeItem we_vote_id={office.we_vote_id}
                      kind_of_ballot_item="OFFICE"
                      ballot_item_display_name={office.ballot_item_display_name} />
          <div className="office-card__additional">
            { office.candidate_list ?
              <div>
                <CandidateList children={office.candidate_list}
                              contest_office_name={office.ballot_item_display_name} />
              </div> :
              null
            }
            {guideToFollowList && guideToFollowList.length === 0 ?
              <p className="office-card__no-additional">{NO_VOTER_GUIDES_TEXT}</p> :
              <div><h3 className="office-card__additional-heading">{"More opinions about " + office.ballot_item_display_name}</h3>
              <GuideList id={electionId} ballotItemWeVoteId={this.state.office_we_vote_id} organizationsToFollow={guideToFollowList}/></div>
            }
          </div>
        </section>
        <br />
      </span>;

  }
}
