import { BigInt, ethereum } from "@graphprotocol/graph-ts"
import { Block, Transaction, GasCalculation } from "../generated/schema"

export function handleBlock(block: ethereum.Block): void {
  let blockEntity = new Block(block.hash.toHex())
  blockEntity.number = block.number
  blockEntity.timestamp = block.timestamp
  blockEntity.baseFeePerGas = block.baseFeePerGas
  blockEntity.save()

  for (let i = 0; i < block.transactions.length; i++) {
    let tx = block.transactions[i]
    handleTransaction(tx, block)
  }
}

function handleTransaction(tx: ethereum.Transaction, block: ethereum.Block): void {
  let txEntity = new Transaction(tx.hash.toHex())
  txEntity.hash = tx.hash
  txEntity.block = block.hash.toHex()
  txEntity.from = tx.from
  txEntity.to = tx.to
  txEntity.value = tx.value
  txEntity.gasPrice = tx.gasPrice
  txEntity.gasUsed = tx.gasUsed
  txEntity.effectiveGasPrice = tx.effectiveGasPrice
  txEntity.save()

  let gasCalcEntity = new GasCalculation(tx.hash.toHex())
  gasCalcEntity.transaction = txEntity.id

  // (gas_price - basefee) * gas_used formülünü uygulayalım
  let baseFee = block.baseFeePerGas ? block.baseFeePerGas : BigInt.fromI32(0)
  let gasPrice = tx.gasPrice
  let gasUsed = tx.gasUsed

  let calculation = gasPrice.minus(baseFee).times(gasUsed)
  gasCalcEntity.result = calculation

  gasCalcEntity.save()
}
