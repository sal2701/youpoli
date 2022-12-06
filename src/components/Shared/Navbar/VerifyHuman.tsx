import { Button } from '@components/UI/Button';
import { Modal } from '@components/UI/Modal';
import { ArrowCircleRightIcon } from '@heroicons/react/outline';
import { Leafwatch } from '@lib/leafwatch';
import type { WidgetProps } from '@worldcoin/id';
import axios from 'axios';
import dynamic from 'next/dynamic';
import type { FC } from 'react';
import { useState } from 'react';
import { useAppStore } from 'src/store/app';
import { USER } from 'src/tracking';

// import { createSetProfileMetadataTypedData } from "../../../../api-examples/src/profile/set-profile-metadata"
// import { CreatePublicSetProfileMetadataUriRequest } from 'lens';
// import { CreatePublicSetProfileMetadataUriRequest } from '../../../../api-examples/src/graphql/generated';

// import createSetProfileMetadataTypedData

const ACTION_ID = 'wid_staging_b0d0a8f9672f866e3d62f621c0cbefb6';
const SIGNAL = 'Hi, I am human.';

const WorldIDWidget = dynamic<WidgetProps>(() => import('@worldcoin/id').then((mod) => mod.WorldIDWidget), {
  ssr: false
});

const VerifyHuman: FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const isHuman = useAppStore((state) => state.isHuman);
  const setIsHuman = useAppStore((state) => state.setIsHuman);

  // const [createSetProfileMetadataTypedData] = useCreateSetProfileMetadataTypedDataMutation({});

  // const request = {
  //   profileId: currentProfile?.id,
  //   metadata: `https://arweave.net/${metadataIpfsId}`
  // }

  // CreatePublicSetProfileMetadataUriRequest

  // const request = {
  //   profileId: currentProfile?.id,
  //   metadata: `https://arweave.net/${500}`
  // }

  // createSetProfileMetadataTypedData(request);

  // const { data, loading, error } = useProfileQuery({
  //   variables: {
  //     request: { profileId: currentProfile?.id }
  //   },
  //   onCompleted: (data) => {
  //     console.log(data);
  //   }
  // });

  // const updateProfileMetadata = async () => {
  //   console.log(currentProfile);

  //   console.log("Minting metadata NFT");

  //   try {
  //     const metadataIpfsId = await uploadToArweave({
  //       profileId: currentProfile?.id,
  //       handle: currentProfile?.handle,
  //       isHuman: true
  //     })

  //     console.log(metadataIpfsId);

  //     const request = {
  //       profileId: currentProfile?.id,
  //       metadata: `https://arweave.net/${metadataIpfsId}`
  //     }

  //     // const result = await createSetProfileMetadataTypedData({
  //     //   variables: {
  //     //     options: { overrideSigNonce: userSigNonce },
  //     //     request
  //     //   }
  //     // });

  //     // console.log(result)
  //   } catch {
  //     console.log("Error");
  //   } finally {
  //     console.log("DONE, trying to refresh.");

  //     const request = {
  //       profileId: currentProfile?.id
  //     }
  //     try{
  //       console.log(data);
  //     } catch (e) {
  //       console.log("ERROR2");
  //       console.log(e);
  //     } finally {
  //       console.log("OUTISDE");
  //     }
  //   }
  // }

  const WorldIDVerify = (verificationResponse: any, currentProfile: any) => {
    console.log(verificationResponse);

    const body = {
      action_id: ACTION_ID,
      signal: SIGNAL,
      proof: verificationResponse['proof'],
      nullifier_hash: verificationResponse['nullifier_hash'],
      merkle_root: verificationResponse['merkle_root']
    };

    axios.post('https://developer.worldcoin.org/api/v1/verify', body).then((response) => {
      console.log(response);
      setIsHuman(true);
      // updateProfileMetadata();
    });
  };

  return (
    <>
      <Modal
        title="Verify Human"
        icon={<ArrowCircleRightIcon className="w-5 h-5 text-brand" />}
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      >
        <div className="grid grid-cols-4 content-center my-6">
          <div />
          {/* <button onClick={() => updateProfileMetadata()}>
            Verify Dummy
          </button> */}
          <WorldIDWidget
            actionId={ACTION_ID}
            signal={SIGNAL}
            enableTelemetry
            onSuccess={(verificationResponse: any) => WorldIDVerify(verificationResponse, currentProfile)}
            onError={(error: any) => console.error(error)}
            debug={true} // to aid with debugging, remove in production
          />
          <div />
        </div>
      </Modal>
      <Button
        icon={<img className="mr-0.5 w-4 h-4" height={16} width={16} src="/lens.png" alt="Lens Logo" />}
        onClick={() => {
          setShowLoginModal(!showLoginModal);
          Leafwatch.track(USER.LOGIN);
        }}
        className="mt-6"
      >
        Verify Human
      </Button>
    </>
  );
};

export default VerifyHuman;
