import { UserSession } from '@esri/arcgis-rest-auth';
import * as Cookies from 'js-cookie';
import { restoreSession } from './session';

jest.mock('js-cookie');
jest.mock('@esri/arcgis-rest-auth');

describe('util', function() {
  describe('session', function() {
    describe('restoreSession', function() {
      beforeEach(function() {
        Cookies.get.mockClear();
      });
      describe('when no cookie', function() {
        it('reads the cookie but does not deserialize', function() {
          Cookies.get.mockReturnValueOnce(undefined);
          restoreSession();
          expect(Cookies.get.mock.calls.length).toBe(1);
          expect(Cookies.get.mock.calls[0][0]).toBe('eaa_session');
          expect(UserSession.deserialize.mock.calls.length).toBe(0);
        });
      });
      describe('when cookie exists', function() {
        it('reads the cookie and deserializes it', function() {
          Cookies.get.mockReturnValueOnce('notarealsession');
          restoreSession();
          expect(Cookies.get.mock.calls.length).toBe(1);
          expect(Cookies.get.mock.calls[0][0]).toBe('eaa_session');
          expect(UserSession.deserialize.mock.calls.length).toBe(1);
          expect(UserSession.deserialize.mock.calls[0][0]).toBe(
            'notarealsession'
          );
        });
      });
    });
  });
});
