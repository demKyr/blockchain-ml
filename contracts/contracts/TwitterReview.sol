// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract TwitterReview {
    address public chairperson;
    uint8 constant MAX_VOTES = 3;
    uint captionCnt = 0;

    struct Caption{
        string content;
        uint8 label;
        uint8[3] Votes;
        bool verified;
        bool goodData;
        address providerAddr;
    }

    Caption[] captions;

    constructor(){
        chairperson = msg.sender;
    }

    function addCaption(string memory _caption, uint8 _lbl) external payable{
        require(msg.value >= 1e18);
        require(_lbl >= 0 && _lbl <= 2);
        captions.push(Caption(_caption, _lbl, [0, 0, 0], false, false, msg.sender));
        captionCnt += 1;
    }

    function reviewCaption(uint _idx, uint8 _lbl) external payable{
        require(captions[_idx].verified == false);
        require(msg.sender != captions[_idx].providerAddr);
        require(_idx < captionCnt && _idx >= 0);
        require(_lbl >= 0 && _lbl <= 2);
        // req only one vote per person
        captions[_idx].Votes[_lbl] += 1;
        if(captions[_idx].Votes[_lbl] == MAX_VOTES){
            captions[_idx].verified = true;
            captions[_idx].goodData = (_lbl == captions[_idx].label);
        }
    }

    function getCaption(uint _idx) public view returns (Caption memory) {
        require(_idx < captionCnt && _idx >= 0);
    	return captions[_idx];
    }

    function getCaptionCnt() public view returns (uint){
        return(captionCnt);
    }

}