pragma solidity ^0.6.0;

contract OffChain {
    address public owner;

    constructor() public {
        owner = msg.sender;
    }

    uint256 private lendingCount = 0;

    // Instance of lendingmodel
    struct LendingModel {
        uint256 lid;
        address payable sender;
        address payable receiver;
        uint256 moneyLended;
    }

    mapping(uint256 => LendingModel) public idToLendingModel;

    event lendingRegistered(uint256 _id);

    function sendMoney(address payable _receipientAddress)
        public
        payable
        returns (uint256)
    {
        LendingModel memory _lendingModel;
        _lendingModel.lid = lendingCount;
        _lendingModel.sender = msg.sender;
        _lendingModel.receiver = _receipientAddress;
        _lendingModel.moneyLended = msg.value;

        idToLendingModel[lendingCount] = _lendingModel;
        lendingCount++;

        _receipientAddress.transfer(msg.value);

        emit lendingRegistered(lendingCount - 1);
        return lendingCount - 1;
    }

    function payBack(uint256 id) public payable {
        LendingModel memory _lendingModel = idToLendingModel[id];
        require(
            _lendingModel.receiver == msg.sender &&
                _lendingModel.moneyLended == msg.value
        );
        _lendingModel.sender.transfer(msg.value);
        delete idToLendingModel[id];
    }
}
