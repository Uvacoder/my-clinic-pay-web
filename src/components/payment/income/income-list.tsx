import {
  Badge,
  Box,
  Button,
  Flex,
  Icon,
  Progress,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { IoAddCircleOutline, IoPencil, IoTrash } from 'react-icons/io5'
import { IncomeService } from '../../../services/payment'
import { Income } from '../../../types/payment/income'
import { toBRL } from '../../../utils/format'
import { CustomAlertDialog } from '../../custom/alert/alert-dialog'

export const IncomeList = () => {
  const [loading, setLoading] = useState(false)
  const [removeId, setRemoveId] = useState('')
  const [incomes, setIncomes] = useState<Income[]>([])
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const fetch = useCallback(async () => {
    try {
      setLoading(true)
      const response = await IncomeService.findAll()
      setIncomes(response.data)
    } catch (error) {
      toast({
        title: 'Erro ao carregar as receitas',
        description: 'Não funfou :(',
        status: 'error',
        position: 'top-right',
        duration: 9000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetch()
  }, [fetch])

  const handleRemove = useCallback(async () => {
    try {
      setLoading(true)
      await IncomeService.deleteById(removeId)
      onClose()
      toast({
        title: 'Sucesso',
        description: 'Removido a receita :)',
        status: 'success',
        position: 'top-right',
        duration: 5000,
        isClosable: true,
      })
      fetch()
    } catch (error) {
      toast({
        title: 'Erro ao remover a receita',
        description: 'Não funfou :(',
        status: 'error',
        position: 'top-right',
        duration: 9000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }, [removeId, onClose, toast, fetch])

  return (
    <Flex w="full" h="full" direction="column" p="4">
      <Flex justifyContent="flex-end">
        <NextLink href="/payment/income/new" shallow passHref>
          <Button
            leftIcon={<Icon as={IoAddCircleOutline} h={6} w={6} mr="2" />}
            bg="primary.purple"
            textColor="white"
            _hover={{ bg: 'primary.darkpurple', textColor: 'white' }}
          >
            Adicionar
          </Button>
        </NextLink>
      </Flex>

      {loading ? (
        <Progress size="xs" isIndeterminate />
      ) : (
        <>
          <Box>
            <Table>
              <Thead>
                <Tr>
                  <Th>Nº da sessão</Th>
                  <Th>Nome</Th>
                  <Th>Data</Th>
                  <Th>Valor</Th>
                  <Th>Descrição</Th>
                  <Th>Pago?</Th>
                  <Th>Valor parcial?</Th>
                  <Th>Opções</Th>
                </Tr>
              </Thead>
              <Tbody>
                {incomes.map((income) => (
                  <Tr key={income.id}>
                    <Td>{income.sessionNumber}</Td>
                    <Td>{income.person.name}</Td>
                    <Td>{new Date(income.date).toLocaleDateString('pt')}</Td>
                    <Td>{toBRL(income.paymentType.value)}</Td>
                    <Td>{income.description}</Td>
                    <Td>
                      <Badge
                        variant="subtle"
                        colorScheme={
                          income.isPaid ? 'primary.neongreen' : 'red'
                        }
                      >
                        {income.isPartial ? 'Sim' : 'Não'}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge
                        variant="subtle"
                        colorScheme={
                          income.isPartial ? 'primary.neongreen' : 'red'
                        }
                      >
                        {income.isPartial ? 'Sim' : 'Não'}
                      </Badge>
                    </Td>
                    <Td>
                      <Box>
                        <NextLink href="">
                          <Button mr="4">Pago</Button>
                        </NextLink>
                        <NextLink href={`payment/income/${income.id}`}>
                          <Button leftIcon={<Icon as={IoPencil} />} mr="4">
                            Editar
                          </Button>
                        </NextLink>
                        <Button
                          leftIcon={<Icon as={IoTrash} />}
                          onClick={() => {
                            setRemoveId(income.id!)
                            onOpen()
                          }}
                        >
                          Remover
                        </Button>
                      </Box>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </>
      )}
      <CustomAlertDialog
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleRemove}
        title="Remover receita"
        description="Deseja remover a receita?"
      />
    </Flex>
  )
}