import { Box, Grid, Skeleton, Stack } from '@mui/material';

export default function ProductLoading() {
  return (
    <Grid container spacing={4}>
      {/* Gallery skeleton */}
      <Grid size={{ xs: 12, md: 5 }}>
        <Skeleton variant="rounded" width="100%" height={420} sx={{ borderRadius: '24px', mb: 1.5 }} />
        <Stack direction="row" spacing={1.5}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="rounded" width={72} height={72} sx={{ borderRadius: '12px' }} />
          ))}
        </Stack>
      </Grid>

      {/* Info skeleton */}
      <Grid size={{ xs: 12, md: 7 }}>
        <Skeleton variant="text" width="70%" height={44} />
        <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />

        <Skeleton variant="text" width="30%" height={36} sx={{ mb: 2 }} />

        <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="circular" width={32} height={32} />
          ))}
        </Stack>

        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="60%" sx={{ mb: 3 }} />

        <Skeleton variant="rounded" width={200} height={48} sx={{ borderRadius: '14px' }} />
      </Grid>

      {/* Related products skeleton */}
      <Grid size={12} sx={{ mt: 4 }}>
        <Skeleton variant="text" width={180} height={32} sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {[1, 2, 3, 4].map((i) => (
            <Grid key={i} size={{ xs: 6, sm: 4, md: 3 }}>
              <Skeleton variant="rounded" width="100%" height={220} sx={{ borderRadius: '16px' }} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}
