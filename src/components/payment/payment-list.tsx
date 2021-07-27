import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import { ExpenseList } from './expense/expense-list'
import { IncomeList } from './income/income-list'

export const PaymentList = () => {
  return (
    <Tabs
      colorScheme="purple"
      id="payment-list"
      isLazy
      w="full"
      h="full"
      size="md"
    >
      <TabList>
        <Tab>Todos</Tab>
        <Tab>Receitas</Tab>
        <Tab>Despesas</Tab>
      </TabList>
      <TabPanels>
        <TabPanel id="all">
          <p>TODO: todos</p>
        </TabPanel>
        <TabPanel id="income">
          <IncomeList />
        </TabPanel>
        <TabPanel id="expense">
          <ExpenseList />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}
