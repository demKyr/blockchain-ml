// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract CaptionReview {
    address public chairperson;
    uint captionCnt = 0;
    uint constant modelCost = 1e18;
    uint constant captionCost = 1e15;
    uint constant reviewCost = 1e15;
    uint constant captionRefund = 1e16;
    uint constant reviewRefund = 1e16;

    struct Caption{
        string content;
        uint256 modelId;
        uint8 proposedLabel;
        uint8 verifiedLabel;
        uint8[] Votes;
        bool verified;
        address providerAddr;
        address[] voters;
        bool trained;
    }

    struct ModelInfo{
        uint256 id;
        string name;
        string description;
        uint256 NumberOfVotes;
        uint256 NumberOfCaptions;
        string[] labels;
        address modelProviderAddr;
        uint256[] accuracy;
    }

    Caption[] captions;

    ModelInfo[] models;

    constructor(){
        chairperson = msg.sender;
    }

    function addModel(string memory _name, string memory _description, uint _NumOfVotes, uint _NumOfCaptions, string[] memory labels) external payable{
        require(msg.value >= modelCost,"Not enough eth");
        require(_NumOfVotes > 0 && _NumOfCaptions > 0,"Invalid Number of Votes or Captions");
        models.push(ModelInfo(models.length, _name, _description, _NumOfVotes, _NumOfCaptions, labels, msg.sender, new uint[](0)));
    }

    function addCaption(string memory _caption, uint8 _lbl, uint _modelId) external payable{
        require(msg.value >= captionCost,"Not enough eth");
        require(_lbl >= 0 && _lbl < models[_modelId].labels.length,"Invalid label");
        captions.push(Caption(_caption, _modelId, _lbl, _lbl, new uint8[](models[_modelId].labels.length), false, msg.sender, new address[](0), false));
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

    function refunding(uint _captionId) private {
        payable(captions[_captionId].providerAddr).transfer(captionRefund);
        for (uint i = 0; i < captions[_captionId].voters.length; i++){
            payable(captions[_captionId].voters[i]).transfer(reviewRefund);
        }
    }

    function reviewCaption(uint _idx, uint8 _lbl, uint _modelId) external payable{
        require(msg.value >= reviewCost,"Not enough eth");
        require(captions[_idx].verified == false, "Cannot review a verified caption");
        require(msg.sender != captions[_idx].providerAddr, "Cannot review your own caption");
        require(_idx < captionCnt && _idx >= 0,"Invalid caption idx");
        require(_lbl >= 0 && _lbl < models[_modelId].labels.length,"Invalid label");
        require(notVoted(msg.sender,_idx),"Only one vote per account for every caption");
        captions[_idx].Votes[_lbl] += 1;
        captions[_idx].voters.push(msg.sender);
        if(captions[_idx].Votes[_lbl] == models[_modelId].NumberOfVotes){
            captions[_idx].verified = true;
            captions[_idx].verifiedLabel = _lbl;
            refunding(_idx);
        }
    }

    function getModels() public view returns( ModelInfo  [] memory){
        return models;
    }

    function getModel(uint _idx) public view returns (ModelInfo memory) {
        require(_idx < models.length && _idx >= 0,"Invalid model idx");
    	return models[_idx];
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

    function updateCaptionTrainStatus(uint[] memory _usedCaptions) public {
        for(uint i = 0; i < _usedCaptions.length ; i++){
            captions[_usedCaptions[i]].trained = true;
        }
    }

    function addAccuracy(uint _idx, uint _acc) public{
        models[_idx].accuracy.push(_acc);
    }

}