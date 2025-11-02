/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `/src/hooks/useBleListener`; params?: Router.UnknownInputParams; } | { pathname: `/src/store/useTrafficStore`; params?: Router.UnknownInputParams; } | { pathname: `/tabs/alert`; params?: Router.UnknownInputParams; } | { pathname: `/tabs/home`; params?: Router.UnknownInputParams; } | { pathname: `/tabs/report`; params?: Router.UnknownInputParams; } | { pathname: `/tabs/settings`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; } | { pathname: `/src/hooks/useBleListener`; params?: Router.UnknownOutputParams; } | { pathname: `/src/store/useTrafficStore`; params?: Router.UnknownOutputParams; } | { pathname: `/tabs/alert`; params?: Router.UnknownOutputParams; } | { pathname: `/tabs/home`; params?: Router.UnknownOutputParams; } | { pathname: `/tabs/report`; params?: Router.UnknownOutputParams; } | { pathname: `/tabs/settings`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/_sitemap${`?${string}` | `#${string}` | ''}` | `/src/hooks/useBleListener${`?${string}` | `#${string}` | ''}` | `/src/store/useTrafficStore${`?${string}` | `#${string}` | ''}` | `/tabs/alert${`?${string}` | `#${string}` | ''}` | `/tabs/home${`?${string}` | `#${string}` | ''}` | `/tabs/report${`?${string}` | `#${string}` | ''}` | `/tabs/settings${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `/src/hooks/useBleListener`; params?: Router.UnknownInputParams; } | { pathname: `/src/store/useTrafficStore`; params?: Router.UnknownInputParams; } | { pathname: `/tabs/alert`; params?: Router.UnknownInputParams; } | { pathname: `/tabs/home`; params?: Router.UnknownInputParams; } | { pathname: `/tabs/report`; params?: Router.UnknownInputParams; } | { pathname: `/tabs/settings`; params?: Router.UnknownInputParams; };
    }
  }
}
