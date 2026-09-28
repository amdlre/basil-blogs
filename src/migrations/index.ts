import * as migration_20260927_144620_initial from './20260927_144620_initial';
import * as migration_20260928_132427_localization from './20260928_132427_localization';

export const migrations = [
  {
    up: migration_20260927_144620_initial.up,
    down: migration_20260927_144620_initial.down,
    name: '20260927_144620_initial',
  },
  {
    up: migration_20260928_132427_localization.up,
    down: migration_20260928_132427_localization.down,
    name: '20260928_132427_localization'
  },
];
