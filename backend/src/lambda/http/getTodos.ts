import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { getUserId} from '../../logic/authHelper';
import { TodosAccess } from '../../data/todosAccess';
import { S3Helper } from '../../logic/s3Helper';
import { ApiResponseHelper } from '../../logic/apiResponseHelper';
import { createLogger } from '../../utils/logger';

const s3Helper =  new S3Helper();
const apiResponseHelper=  new ApiResponseHelper();
const logger =  createLogger('todos');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	const authHeader =  event.headers['Authorization'];
    const userId =  getUserId(authHeader);
    logger.info(`get groups for user ${userId}`);
    const result =  await new TodosAccess().getUserTodos(userId);
	for(const record of result){
        record.attachmentUrl = await s3Helper.getTodoAttachmentUrl(record.todoId);
    }


	// TODO: Get all TODO items for a current user
	return apiResponseHelper.generateDataSuccessResponse(200,'items',result);
}
