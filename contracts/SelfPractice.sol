pragma solidity ^0.4.17;

contract SelfPractice {
    address public manager;
    address[] public entries;
    // uint[] public entriesMonies;
    uint private collectedFees = 0; // might not need this
    // uint[] public data;
    struct NftInfo {
        uint ethr;
        uint msgHash;
    }
    mapping(address => NftInfo) public entriesData;

    function SelfPractice() public {
        manager = msg.sender;
    }

    function hashData(string message) private view returns (uint) {
        return uint(sha256(block.difficulty, now, message));
    }

    function enter(string message) public payable {
        require(msg.value > 0.01 ether);
        collectedFees += 0.003 ether; // might remove this

        NftInfo memory nft;
        // entriesMonies.push(msg.value - 0.003 ether);
        entries.push(msg.sender);
        // data.push(hashData(message));
        nft = NftInfo(msg.value - 0.003 ether, hashData(message));
        entriesData[msg.sender] = nft;
    }

    function getEntrants() public view returns (address[]) {
        return entries;
    }

    function retrieveNftEthr() public view returns (uint) {
        return entriesData[msg.sender].ethr;
    }

    function retrieveNftMsgHash() public view returns (uint) {
        return entriesData[msg.sender].msgHash;
    }

    function getManager() public view returns (address) {
        return manager;
    }
}
