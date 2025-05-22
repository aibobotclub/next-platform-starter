"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { BsThreeDotsVertical } from "react-icons/bs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination"

const transactions = [
  {
    timestamp: "23-06-01 09:30",
    recipientAddress: "0x1234...5678",
    amount: "0.5 ETH",
    transactionId: "0xabcd...ef01",
    status: "success",
    details: "Transaction completed successfully. Gas fee: 0.002 ETH",
  },
  {
    timestamp: "23-06-02 14:45",
    recipientAddress: "0x9876...3210",
    amount: "1.2 ETH",
    transactionId: "0xfedc...ba98",
    status: "pending",
    details: "Transaction is pending. Estimated completion time: 5 minutes",
  },
  {
    timestamp: "23-06-03 11:20",
    recipientAddress: "0x2468...1357",
    amount: "0.8 ETH",
    transactionId: "0x1357...2468",
    status: "failed",
    details: "Transaction failed due to insufficient gas. Please try again with a higher gas limit.",
  },
  {
    timestamp: "23-06-04 16:10",
    recipientAddress: "0x3690...1478",
    amount: "2.0 ETH",
    transactionId: "0x2580...3690",
    status: "success",
    details: "Transaction completed successfully. Gas fee: 0.003 ETH",
  },
  {
    timestamp: "23-06-05 08:55",
    recipientAddress: "0x7531...9512",
    amount: "0.3 ETH",
    transactionId: "0x8642...7531",
    status: "pending",
    details: "Transaction is pending. Estimated completion time: 3 minutes",
  },
  {
    timestamp: "23-06-06 13:40",
    recipientAddress: "0x1597...5310",
    amount: "1.5 ETH",
    transactionId: "0x9513...7531",
    status: "success",
    details: "Transaction completed successfully. Gas fee: 0.0025 ETH",
  },
  {
    timestamp: "23-06-02 14:45",
    recipientAddress: "0x9876...3210",
    amount: "1.2 ETH",
    transactionId: "0xfedc...ba98",
    status: "pending",
    details: "Transaction is pending. Estimated completion time: 5 minutes",
  },
  {
    timestamp: "23-06-06 13:40",
    recipientAddress: "0x1597...5310",
    amount: "1.5 ETH",
    transactionId: "0x9513...7531",
    status: "success",
    details: "Transaction completed successfully. Gas fee: 0.0025 ETH",
  },
]

const statusColors = {
  success: "text-green-600",
  pending: "text-yellow-600",
  failed: "text-red-600",
}

const TransactionDetails = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([])
  const itemsPerPage = 6
  const totalPages = Math.ceil(transactions.length / itemsPerPage)

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentTransactions = transactions.slice(startIndex, endIndex)

  const handleDownload = (transaction: (typeof transactions)[0]) => {
    const content = `Transaction Details:
Timestamp: ${transaction.timestamp}
Recipient: ${transaction.recipientAddress}
Amount: ${transaction.amount}
Transaction ID: ${transaction.transactionId}
Status: ${transaction.status}
Details: ${transaction.details}`

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transaction_${transaction.transactionId}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTransactions(currentTransactions.map((t) => t.transactionId))
    } else {
      setSelectedTransactions([])
    }
  }

  const handleSelectTransaction = (transactionId: string, checked: boolean) => {
    if (checked) {
      setSelectedTransactions([...selectedTransactions, transactionId])
    } else {
      setSelectedTransactions(selectedTransactions.filter((id) => id !== transactionId))
    }
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="">
              <TableHead className="min-w-[120px] text-colors-BlueGray font-bold font-source text-sm ml-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="select-all"
                    checked={
                      currentTransactions.length > 0 && selectedTransactions.length === currentTransactions.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                  <label htmlFor="select-all">Time stamp</label>
                </div>
              </TableHead>
              <TableHead className="min-w-[180px] text-colors-BlueGray font-bold font-source text-sm">
                Recipient address
              </TableHead>
              <TableHead className="min-w-[100px] text-colors-BlueGray font-bold font-source text-sm">Amount</TableHead>
              <TableHead className="min-w-[180px] text-colors-BlueGray font-bold font-source text-sm">
                Transaction ID
              </TableHead>
              <TableHead className="min-w-[100px] text-colors-BlueGray font-bold font-source text-sm">Status</TableHead>
              <TableHead className="min-w-[80px] text-colors-BlueGray font-bold font-source text-sm"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTransactions.map((transaction) => (
              <TableRow key={transaction.transactionId}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`checkbox-${transaction.transactionId}`}
                      checked={selectedTransactions.includes(transaction.transactionId)}
                      onCheckedChange={(checked) =>
                        handleSelectTransaction(transaction.transactionId, checked as boolean)
                      }
                    />
                    <label htmlFor={`checkbox-${transaction.transactionId}`}>{transaction.timestamp}</label>
                  </div>
                </TableCell>
                <TableCell>{transaction.recipientAddress}</TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>{transaction.transactionId}</TableCell>
                <TableCell className={statusColors[transaction.status as keyof typeof statusColors]}>
                  {transaction.status}
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <BsThreeDotsVertical className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="flex flex-col">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" className="justify-start text-colors-BlueGray font-geist">
                                View details
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Transaction Details</DialogTitle>
                              </DialogHeader>
                              <div className="mt-2">
                                <p>
                                  <strong>Timestamp:</strong> {transaction.timestamp}
                                </p>
                                <p>
                                  <strong>Recipient:</strong> {transaction.recipientAddress}
                                </p>
                                <p>
                                  <strong>Amount:</strong> {transaction.amount}
                                </p>
                                <p>
                                  <strong>Transaction ID:</strong> {transaction.transactionId}
                                </p>
                                <p>
                                  <strong>Status:</strong> {transaction.status}
                                </p>
                                <p>
                                  <strong>Details:</strong> {transaction.details}
                                </p>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <hr className="w-full text-colors-DarkGray h-2" />
                          <Button
                            variant="ghost"
                            className="justify-start text-colors-BlueGray font-geist"
                            onClick={() => handleDownload(transaction)}
                          >
                            Download pdf
                          </Button>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="">
        <Pagination className="cursor-pointer">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink onClick={() => handlePageChange(page)} isActive={currentPage === page}>
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

export default TransactionDetails