import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import {
  ISignInReq,
  ISignInRes,
  ISignUpReq,
} from '@libs/authentication-shared';
import { IUser } from '@libs/core-shared';
import { UserId } from '@libs/shared';
import { AuthenticationApiService } from './authentication-api.service';

jest.mock('@libs/core-web');

describe('AuthApiService', () => {
  let apiService: AuthenticationApiService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthenticationApiService],
    });
    apiService = TestBed.inject(AuthenticationApiService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('creates service', () => {
    expect(apiService).toBeDefined();
  });

  it('should correctly request signUp', waitForAsync(() => {
    const payload: ISignUpReq = {
      username: 'user',
      email: 'test@ema.il',
      password: 'pass',
    };
    const res: IUser = {
      id: 1 as UserId,
      username: 'user',
      email: 'test@ema.il',
      createdDate: new Date(),
      updatedDate: new Date(),
    };

    apiService.signUp(payload).subscribe((response) => {
      expect(response).toEqual(res);
    });
    const req = httpController.expectOne('https://test.com/auth/sing-up');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(res);
  }));

  it('should correctly request signIn', waitForAsync(() => {
    const payload: ISignInReq = {
      email: 'test@ema.il',
      password: 'pass',
    };
    const res: ISignInRes = {
      userId: 1 as UserId,
      accessTokenExp: 0,
      refreshTokenExp: 0,
    };

    apiService.signIn(payload).subscribe((response) => {
      expect(response).toEqual(res);
    });
    const req = httpController.expectOne('https://test.com/auth/sing-in');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(payload);

    req.flush(res);
  }));
});
