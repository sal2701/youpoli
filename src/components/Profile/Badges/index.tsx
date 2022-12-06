import type { Profile } from 'lens';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';

import Ens from './Ens';
import ProofOfHumanity from './ProofOfHumanity';
import Sybil from './Sybil';
import Worldcoin from './Worldcoin';

interface Props {
  profile: Profile;
}

const Badges: FC<Props> = ({ profile }) => {
  const isHuman = useAppStore((state) => state.isHuman);

  const hasOnChainIdentity =
    profile?.onChainIdentity?.proofOfHumanity ||
    profile?.onChainIdentity?.sybilDotOrg?.verified ||
    profile?.onChainIdentity?.ens?.name ||
    profile?.onChainIdentity?.worldcoin?.isHuman;

  if (!hasOnChainIdentity && !isHuman) {
    return null;
  }

  return (
    <>
      <div className="w-full divider" />
      <div className="flex flex-wrap gap-3">
        <ProofOfHumanity profile={profile} />
        <Ens profile={profile} />
        <Sybil profile={profile} />
        <Worldcoin profile={profile} isHuman={isHuman} />
      </div>
    </>
  );
};

export default Badges;
