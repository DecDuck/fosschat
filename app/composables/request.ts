import type {
  ExtractedRouteMethod,
  NitroFetchOptions,
  NitroFetchRequest,
  TypedInternalResponse,
} from "nitropack/types";

interface AppFetch<
  DefaultT = unknown,
  DefaultR extends NitroFetchRequest = NitroFetchRequest
> {
  <
    T = DefaultT,
    R extends NitroFetchRequest = DefaultR,
    O extends NitroFetchOptions<R> = NitroFetchOptions<R>
  >(
    request: R,
    opts?: O
  ): Promise<
    // @ts-ignore
    TypedInternalResponse<
      R,
      T,
      NitroFetchOptions<R> extends O ? "get" : ExtractedRouteMethod<R, O>
    >
  >;
}

export const $appFetch: AppFetch = async (request, opts) => {
  if (!getCurrentInstance()?.proxy) {
    return (await $fetch(request, opts)) as any;
  }
  const id = request.toString();

  const state = useState(id);
  if (state.value) {
    // Deep copy
    const object = JSON.parse(JSON.stringify(state.value));
    // Never use again on client
    state.value = undefined;
    return object;
  }

  const headers = useRequestHeaders(["cookie", "authorization"]);
  const data = await $fetch(request, {
    ...opts,
    headers: { ...opts?.headers, ...headers },
  } as any);
  if (import.meta.server) state.value = data;
  return data as any;
};
