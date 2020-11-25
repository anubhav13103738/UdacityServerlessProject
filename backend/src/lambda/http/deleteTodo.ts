import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { getUserId} from '../../logic/authHelper';
import { TodosAccess } from '../../data/todosAccess';
import { ApiResponseHelper } from '../../logic/apiResponseHelper';
import { createLogger } from '../../utils/logger';

const todosAccess = new TodosAccess();
const apiResponseHelper = new ApiResponseHelper();
const logger = createLogger('todos');


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	const todoId =  event.pathParameters.todoId;
	if(!todoId){
        logger.error('invalid delete todo id is missing');
        return apiResponseHelper.generateErrorResponse(400,'invalid parameters');
    }
	const authHeader =  event.headers['Authorization'];
    const userId =  getUserId(authHeader);

	const item =  await  todosAccess.getTodoById(todoId);
	if(item.Count == 0){
        logger.error(`unable to delete todo with id ${todoId} This todo item does not exist`);
        return apiResponseHelper.generateErrorResponse(400,'TODO not exists');
    }
	if(item.Items[0].userId !== userId){
        logger.error(`user ${userId} trying to delete todo of other account with id ${todoId}`);
        return apiResponseHelper.generateErrorResponse(400,'TODO does not belong to authorized user');
    }
	logger.info(`User ${userId} deleting todo ${todoId}`);
    await todosAccess.deleteTodoById(todoId);
    return apiResponseHelper.generateEmptySuccessResponse(204);
}
