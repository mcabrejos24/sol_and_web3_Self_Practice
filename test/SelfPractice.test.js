const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const { interface, bytecode } = require('../compile');

let contract;
let accounts;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    contract = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode })
        .send({ from: accounts[0], gas: '1000000' });
});

describe('SelfPractice Contract', () => {
    it('contract deployed successfully', () => {
        assert.ok(contract.options.address);
    });

    it('allows one entrant to enter', async () => {
        await contract.methods.enter('myMessage').send({
            from: accounts[0],
            value: web3.utils.toWei('1', 'ether'),
            gas: '1000000'
        });

        const entrants = await contract.methods.getEntrants().call({
            from: accounts[0]
        });
        assert.equal(entrants[0], accounts[0]);
        assert.equal(entrants.length, 1);
    });

    it('allows multiple entrant to enter', async () => {
        await contract.methods.enter('myMessage').send({
            from: accounts[0],
            value: web3.utils.toWei('1', 'ether'),
            gas: '1000000'
        });
        await contract.methods.enter('myMessage').send({
            from: accounts[1],
            value: web3.utils.toWei('1', 'ether'),
            gas: '1000000'
        });
        await contract.methods.enter('myMessage').send({
            from: accounts[2],
            value: web3.utils.toWei('1', 'ether'),
            gas: '1000000'
        });


        const entrants = await contract.methods.getEntrants().call({
            from: accounts[0]
        });
        assert.equal(entrants[0], accounts[0]);
        assert.equal(entrants[1], accounts[1]);
        assert.equal(entrants[2], accounts[2]);
        assert.equal(entrants.length, 3);
    });

    it('requires a minimum amount of ether to enter', async () => {
        let executed;

        try {
            await contract.methods.enter('myMessage').send({
                from: accounts[0],
                value: 0,
                gas: '1000000'
            });
            executed = 'success';
        } catch (err) {
            executed = 'fail';
        }
        assert.equal('fail', executed);
    });

    it('checks nft info provided to reteived', async () => {
        await contract.methods.enter('myMessage').send({
            from: accounts[1],
            value: web3.utils.toWei('1', 'ether'),
            gas: '1000000'
        });

        const nftMessage = await contract.methods.retrieveNftOgMessage().call({
            from: accounts[1]
        });

        const nftEther = await contract.methods.retrieveNftEthr().call({
            from: accounts[1]
        });

        assert.equal(nftMessage, 'myMessage');
        assert(nftEther > web3.utils.toWei('0.007', 'ether'));
    });
});
