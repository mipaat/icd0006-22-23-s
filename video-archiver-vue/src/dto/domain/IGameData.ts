export interface IGameData {
    igdbId: string | null;
    name: string | null;
    boxArtUrl: string | null;
    etag: string | null;
    lastFetched: Date | null;
    lastSuccessfulFetch: Date | null;
}