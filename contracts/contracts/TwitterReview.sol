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
        address[] voters;
    }

    string[] CaptionTexts;

    Caption[] public captions;

    constructor(){
        chairperson = msg.sender;
    }

    function addCaption(string memory _caption, uint8 _lbl) external payable{
        require(msg.value >= 1e18,"Not enough eth");
        require(_lbl >= 0 && _lbl <= 2,"Illegal label");
        captions.push(Caption(_caption, _lbl, [0, 0, 0], false, false, msg.sender, new address[](0)));
        CaptionTexts.push(_caption);
        captionCnt += 1;
    }

    function notVoted(address _voter, uint _idx) private view returns (bool) {
        for (uint i = 0; i < captions[_idx].voters.length; i++) {
            if (captions[_idx].voters[i] == _voter) {
                return false;
            }
        }
        return true;
    }

    function reviewCaption(uint _idx, uint8 _lbl) external payable{
        require(captions[_idx].verified == false, "Cannot review a verified caption");
        require(msg.sender != captions[_idx].providerAddr, "Cannot review your own caption");
        require(_idx < captionCnt && _idx >= 0,"Invalid caption idx");
        require(_lbl >= 0 && _lbl <= 2,"Invalid label");
        require(notVoted(msg.sender,_idx),"Only one vote per account for every caption");
        captions[_idx].Votes[_lbl] += 1;
        captions[_idx].voters.push(msg.sender);
        if(captions[_idx].Votes[_lbl] == MAX_VOTES){
            captions[_idx].verified = true;
            captions[_idx].goodData = (_lbl == captions[_idx].label);
        }
    }

    function getCaptions() public view returns( Caption  [] memory){
        return captions;
    }

    function getCaption(uint _idx) public view returns (Caption memory) {
        require(_idx < captionCnt && _idx >= 0,"Invalid caption idx");
    	return captions[_idx];
    }

    function getCaptionCnt() public view returns (uint){
        return(captionCnt);
    }

    function getCaptionText(uint _idx) public view returns (string memory){
        require(_idx < captionCnt && _idx >= 0,"Invalid caption idx");
        return captions[_idx].content;
    }

    function getCaptionTexts() public view returns (string[] memory){
        return CaptionTexts;
    }

}