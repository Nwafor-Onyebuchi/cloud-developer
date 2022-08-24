import 'source-map-support/register'

import * as uuid from 'uuid'
const uuidv4 = require('uuid/v4')
import { ToDoAccess } from '../dataLayer/TodosAccess'
// import { TodosStorage } from '../dataLayer/TodosStorage'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import { parseUserId } from '../auth/utils'

const logger = createLogger('todos')

const todosAccess = new ToDoAccess()
// const todosStorage = new TodosStorage()

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
  logger.info(`Retrieving all todos for user ${userId}`, { userId })

  return await todosAccess.getAllToDo(userId)
}

export function createToDo(
  createTodoRequest: CreateTodoRequest,
  jwtToken: string
): Promise<TodoItem> {
  const userId = parseUserId(jwtToken)
  const todoId = uuidv4()
  const s3BucketName = process.env.S3_BUCKET_NAME

  return todosAccess.createToDo({
    userId: userId,
    todoId: todoId,
    attachmentUrl: `https://${s3BucketName}.s3.amazonaws.com/${todoId}`,
    createdAt: new Date().getTime().toString(),
    done: false,
    ...createTodoRequest
  })
}

export function updateToDo(
  updateTodoRequest: UpdateTodoRequest,
  todoId: string,
  jwtToken: string
): Promise<TodoUpdate> {
  const userId = parseUserId(jwtToken)
  return todosAccess.updateToDo(updateTodoRequest, todoId, userId)
}

export function deleteToDo(todoId: string, jwtToken: string): Promise<string> {
  const userId = parseUserId(jwtToken)
  return todosAccess.deleteToDo(todoId, userId)
}

export function generateUploadUrl(todoId: string): Promise<string> {
  return todosAccess.generateUploadUrl(todoId)
}
