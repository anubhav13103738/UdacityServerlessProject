import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { CreateTodoRequest } from '../../requests/CreateTodoRequest';
import { getUserId} from '../../logic/authHelper';
import { TodosAccess } from '../../data/todosAccess';
import { ApiResponseHelper } from '../../logic/apiResponseHelper'
import { createLogger } from '../../utils/logger'

const logger = createLogger('todos');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	const newTodo: CreateTodoRequest =  JSON.parse(event.body);

	const authHeader =  event.headers['Authorization'];
	const userId =  getUserId(authHeader);
	logger.info(`create group with data ${newTodo}`);
	const item =  await new TodosAccess().createTodo(newTodo,userId);
	return new ApiResponseHelper().generateDataSuccessResponse(201,'item',item);
}
