import { BigInt, ethereum } from "@graphprotocol/graph-ts"
import { Block, Transaction } from "../generated/schema"
import { Transfer as TransferEvent } from "../generated/EthereumCore/EthereumCore" // Bu satırı ekleyin

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
}

export function handleTransfer(event: TransferEvent): void {
  // Transfer olayını işlemek için gereken kodu buraya yazın
}