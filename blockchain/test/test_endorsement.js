const truffleAssert = require("truffle-assertions");
const assert = require("assert");

const Endorsement = artifacts.require("Endorsement");

contract("Endorsement", (accounts) => {
  const deployingAccount = accounts[0];
  const user1 = accounts[1];
  const user2 = accounts[2];
  const user3 = accounts[3];

  let endorsementInstance;

  before(async () => {
    endorsementInstance = await Endorsement.new({
      from: deployingAccount
    });
  });

  it("should not endorse self", async () => {
    // Try to endorse self
    await truffleAssert.fails(
      endorsementInstance.endorse(user1, { from: user1 }),
      truffleAssert.ErrorType.REVERT
    );
  });

  it("should endorse user", async () => {
    // User2 endorses user1
    await truffleAssert.passes(
      endorsementInstance.endorse(user1, { from: user2 }),
      "Failed to endorse user"
    );

    // Check user1's endorsers
    const user1Endorsers = await endorsementInstance.getEndorsers(user1);
    assert.deepEqual(user1Endorsers, [user2], "User1 should have only user2 as an endorser");

    // Check user1's endorser count
    const user1EndorsementCount = await endorsementInstance.getEndorserCount(user1);
    assert.equal(user1EndorsementCount.toNumber(), 1, "User1 should have only 1 endorser");

    // Check user2's endorsees
    const user2Endorsees = await endorsementInstance.getEndorsees(user2);
    assert.deepEqual(user2Endorsees, [user1], "User2 should have only user1 as an endorsee");

    // Check user2's endorsee count
    const user2EndorsementCount = await endorsementInstance.getEndorseeCount(user2);
    assert.equal(user2EndorsementCount.toNumber(), 1, "User2 should have only 1 endorsee");
  });

  it("should allow multiple endorsers", async () => {
    // User3 endorses user1
    await truffleAssert.passes(
      endorsementInstance.endorse(user1, { from: user3 }),
      "Failed to endorse user"
    );

    // Check user1's endorsers
    const user1Endorsers = await endorsementInstance.getEndorsers(user1);
    assert.deepEqual(user1Endorsers, [user2, user3], "User1 should have user2 and user3 as endorsers");

    // Check user1's endorser count
    const user1EndorsementCount = await endorsementInstance.getEndorserCount(user1);
    assert.equal(user1EndorsementCount.toNumber(), 2, "User1 should have 2 endorsers");

    // Check user2's endorsees
    const user2Endorsees = await endorsementInstance.getEndorsees(user2);
    assert.deepEqual(user2Endorsees, [user1], "User2 should have only user1 as an endorsee");

    // Check user2's endorsee count
    const user2EndorsementCount = await endorsementInstance.getEndorseeCount(user2);
    assert.equal(user2EndorsementCount.toNumber(), 1, "User2 should have only 1 endorsee");

    // Check user3's endorsees
    const user3Endorsees = await endorsementInstance.getEndorsees(user3);
    assert.deepEqual(user3Endorsees, [user1], "User3 should have only user1 as an endorsee");

    // Check user3's endorsee count
    const user3EndorsementCount = await endorsementInstance.getEndorseeCount(user3);
    assert.equal(user3EndorsementCount.toNumber(), 1, "User3 should have only 1 endorsee");
  });

  it("should not endorse same user twice", async () => {
    // User2 endorses user1 again
    await truffleAssert.fails(
      endorsementInstance.endorse(user1, { from: user2 }),
      truffleAssert.ErrorType.REVERT
    );
  });

  it("should not retract non-existent endorsement", async () => {
    // Try to retract non-existent endorsement
    await truffleAssert.fails(
      endorsementInstance.retract(user2, { from: user1 }),
      truffleAssert.ErrorType.REVERT
    );
  });

  it("should retract endorsement", async () => {
    // User2 retract endorsement on user1
    await truffleAssert.passes(
      endorsementInstance.retract(user1, { from: user2 }),
      "User2 failed to retract endorsement"
    );

    // User 3 retracts endorsement on user1
    await truffleAssert.passes(
      endorsementInstance.retract(user1, { from: user3 }),
      "User3 failed to retract endorsement"
    );

    // Check user1's endorsers
    const user1Endorsers = await endorsementInstance.getEndorsers(user1);
    assert.deepEqual(user1Endorsers, [], "User1 should have no endorsers");

    // Check user1's endorser count
    const user1EndorsementCount = await endorsementInstance.getEndorserCount(user1);
    assert.equal(user1EndorsementCount.toNumber(), 0, "User1 should have 0 endorsers");

    // Check user2's endorsees
    const user2Endorsees = await endorsementInstance.getEndorsees(user2);
    assert.deepEqual(user2Endorsees, [], "User2 should have no endorsees");

    // Check user2's endorsee count
    const user2EndorsementCount = await endorsementInstance.getEndorseeCount(user2);
    assert.equal(user2EndorsementCount.toNumber(), 0, "User2 should have 0 endorsees");
  });
});
