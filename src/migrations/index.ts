import * as migration_20260927_144620_initial from './20260927_144620_initial';

export const migrations = [
  {
    up: migration_20260927_144620_initial.up,
    down: migration_20260927_144620_initial.down,
    name: '20260927_144620_initial'
  },
];
