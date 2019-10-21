/**
*/
'use strict';
/**
 * Creates a new Company
 * @param {org.example.empty.SubmitHouseholdNotProducingEnergy} householdNPESubmission - the SubmitHouseholdNotProducingEnergy transaction to be processed
 * @transaction
 */
async function addHouseholdNPE(householdSubmission){

    // create Company asset
    var factory = getFactory();
	// to create a resource; give the identifier, here name, as an argument
	var household = factory.newResource('org.example.empty', 'Household', householdSubmission.id);
    household.adress = householdSubmission.adress;
	household.powerCoinBalance = 0;
  	household.pendingEnergyBalance = 0;
    household.canProduceEnergy = false;
	
	// save the new company on the blockchain
	let householdRegistry = await getAssetRegistry('org.example.empty.Household');
  
	// for participants, use getParticipantRegistry
	await householdRegistry.add(household);
}

/**
 * Creates a new Company
 * @param {org.example.empty.SubmitHouseholdProducingEnergy} householdPESubmission - the SubmitHouseholdProducingEnergy transaction to be processed
 * @transaction
 */
async function addHouseholdPE(householdSubmission){

    // create Company asset
    var factory = getFactory();
	// to create a resource; give the identifier, here name, as an argument
	var household = factory.newResource('org.example.empty', 'Household', householdSubmission.id);
    household.adress = householdSubmission.adress;
	household.powerCoinBalance = 0;
  	household.pendingEnergyBalance = 0;
    household.canProduceEnergy = true;
	
	// save the new company on the blockchain
	let householdRegistry = await getAssetRegistry('org.example.empty.Household');
	// for participants, use getParticipantRegistry
	await householdRegistry.add(household);
}

/**
 * Creates a new Company
 * @param {org.example.empty.NewTransaction} transactionSubmission - the NewTransaction transaction to be processed
 * @transaction
 */
async function addTransaction(transactionSubmission){

    // create Company asset
    var factory = getFactory();
	// to create a resource; give the identifier, here name, as an argument
	var transaction = factory.newResource('org.example.empty', 'Transaction', transactionSubmission.id);
    transaction.amount = transactionSubmission.amount;
	transaction.date = new Date();
  	transaction.energyPrice = transactionSubmission.energyPrice;
    transaction.gridFee = transactionSubmission.gridFee;
	transaction.consumer = transactionSubmission.consumer;
  	transaction.supplier = transactionSubmission.supplier;
  
	// save the new company on the blockchain
	let transactionRegistry = await getAssetRegistry('org.example.empty.Transaction');
	// for participants, use getParticipantRegistry
	await transactionRegistry.add(transaction);
  
  	transactionSubmission.supplier.powerCoinBalance += transactionSubmission.amount * transactionSubmission.energyPrice;
  	transactionSubmission.consumer.powerCoinBalance -= transactionSubmission.amount * transactionSubmission.energyPrice + transactionSubmission.gridFee;
  	let HouseholdRegistry = await getAssetRegistry('org.example.empty.Household');
  	await HouseholdRegistry.update(transactionSubmission.supplier);
  	await HouseholdRegistry.update(transactionSubmission.consumer);
  
}