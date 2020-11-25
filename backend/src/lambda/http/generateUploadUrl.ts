import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { S3Helper } from '../../logic/s3Helper';
import { ApiResponseHelper } from '../../logic/apiResponseHelper';
import { TodosAccess } from '../../data/todosAccess';
import { getUserId} from '../../logic/authHelper';
import { createLogger } from '../../utils/logger';

const todosAccess =  new TodosAccess();
const apiResponseHelper =  new ApiResponseHelper();
const logger =  createLogger('todos');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	const todoId =  event.pathParameters.todoId;
	const authHeader =  event.headers['Authorization'];
    const userId =  getUserId(authHeader);

	const item =  await todosAccess.getTodoById(todoId);
	if(item.Count == 0){
        logger.error(`url requested for non exists todo with id ${todoId} by ${userId}`);
        return apiResponseHelper.generateErrorResponse(400,'TODO not exists');
    }

	if(item.Items[0].userId !== userId){
        logger.error(`requested url todo belong to another account with todo id ${todoId}`);
        return apiResponseHelper.generateErrorResponse(400,'TODO does not belong to authorized user');
    }

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
	const url =  new S3Helper().getPresignedUrl(todoId);
    return apiResponseHelper.generateDataSuccessResponse(200,"uploadUrl",url);
}
