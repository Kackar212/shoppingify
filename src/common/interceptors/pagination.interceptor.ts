import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Scope } from '@nestjs/common';
import { map } from 'rxjs/operators';

function getURLWithPage(url: URL, page: number) {
  const requestUrl = new URL(url);
  requestUrl.searchParams.set('page', page.toString());

  return requestUrl.toString();
}

@Injectable({ scope: Scope.REQUEST })
export class PaginationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map(async (response) => {
        const {
          pagination: { total, page: currentPage, take },
        } = response;

        const url = new URL(request.url, process.env.APP_URL);

        const page: Record<string, number> = {};
        page.last = Math.ceil(total / take);
        page.first = 1;
        page.current = currentPage;
        page.next = currentPage + 1 > page.last ? currentPage : currentPage + 1;
        page.previous = currentPage - 1 < page.first ? page.first : currentPage - 1;

        return {
          ...response,
          pagination: {
            total,
            page,
            links: {
              current: getURLWithPage(url, page.current),
              last: getURLWithPage(url, page.last),
              first: getURLWithPage(url, page.first),
              next: getURLWithPage(url, page.next),
              previous: getURLWithPage(url, page.previous),
            },
            take,
          },
        };
      }),
    );
  }
}
