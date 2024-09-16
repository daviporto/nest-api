// import { WrapperDataInterceptor } from '../../wrapper-data.interceptor';
// import { UserDataBuilder } from '@/user/domain/testing/helper/user-data-builder';
// import { of } from 'rxjs';
//
// describe('Wrapper data interceptor unit tests', () => {
//   let interceptor: WrapperDataInterceptor;
//   let props = UserDataBuilder({});
//
//   beforeEach(() => {
//     interceptor = new WrapperDataInterceptor();
//   });
//
//   it('should be defined', () => {
//     expect(interceptor).toBeDefined();
//   });
//
//   it('should return the body if it is null', () => {
//     const obs$ = interceptor.intercept({} as any, { handle: () => of(props) });
//
//     obs$.subscribe({
//       next: (result) => {
//         expect(result).toStrictEqual({ data: props });
//       },
//     });
//   });
//
//   it('should return the body if it has a meta property', () => {
//     const expected = {
//       data: props,
//       meta: {
//         total: 10
//       },
//     };
//
//     const obs$ = interceptor.intercept({} as any, {
//       handle: () => of(expected),
//     });
//
//     obs$.subscribe({
//       next: (result) => {
//         console.log(result);
//         expect(result).toMatchObject(expected);
//       },
//     });
//   });
//
//   it('should return the body if it is not null and does not have a meta property', () => {
//     const obs$ = interceptor.intercept({} as any, { handle: () => of(null) });
//
//     obs$.subscribe({
//       next: (result) => {
//         expect(result).not.toHaveProperty('meta');
//         expect(result).toBe(null)
//       },
//     });
//   });
// });
