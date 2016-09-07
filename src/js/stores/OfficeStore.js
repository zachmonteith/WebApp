var Dispatcher = require("../dispatcher/Dispatcher");
var FluxMapStore = require("flux/lib/FluxMapStore");
const assign = require("object-assign");

class OfficeStore extends FluxMapStore {

  reduce (state, action) {

    // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
    if (!action.res || !action.res.success)
      return state;

    var key;
    var merged_properties;

    switch (action.type) {

      case "officeRetrieve":
        console.log("OfficeStore officeRetrieve action.res:", action.res);
        key = action.res.we_vote_id;
        console.log("OfficeStore Retrieve Key:", key);
        merged_properties = assign({}, state.get(key), action.res );
        return state.set(key, merged_properties );

      case "voterBallotItemsRetrieve":
        let offices = {};
        action.res.ballot_item_list.forEach(one_ballot_item =>{
          if (one_ballot_item.kind_of_ballot_item === "OFFICE") {
            offices[one_ballot_item.we_vote_id] = one_ballot_item;
          }
        });

        return {
          ...state,
          offices: assign({}, state.offices, offices )
        };

      case "error-officeRetrieve":
        console.log(action);
        return state;

      default:
        return state;
    }

  }

}

module.exports = new OfficeStore(Dispatcher);
