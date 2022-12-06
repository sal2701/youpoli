import EventType from '@components/Home/Timeline/EventType';
import UserProfile from '@components/Shared/UserProfile';
import type { LensterPublication } from '@generated/types';
import { Leafwatch } from '@lib/leafwatch';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { ElectedMirror, FeedItem } from 'lens';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import { PUBLICATION } from 'src/tracking';

import PublicationActions from './Actions';
import ModAction from './Actions/ModAction';
import HiddenPublication from './HiddenPublication';
import PublicationBody from './PublicationBody';
import PublicationType from './Type';

dayjs.extend(relativeTime);

interface Props {
  publication: LensterPublication;
  feedItem?: FeedItem;
  showType?: boolean;
  showActions?: boolean;
  showModActions?: boolean;
  showThread?: boolean;
}

const SinglePublication: FC<Props> = ({
  publication,
  feedItem,
  showType = true,
  showActions = true,
  showModActions = false,
  showThread = true
}) => {
  const { push } = useRouter();
  const isMirror = publication.__typename === 'Mirror';
  const firstComment = feedItem?.comments && feedItem.comments[0];
  const rootPublication = feedItem ? (firstComment ? firstComment : feedItem?.root) : publication;
  const profile = feedItem
    ? rootPublication.profile
    : isMirror
    ? publication?.mirrorOf?.profile
    : publication?.profile;
  const timestamp = feedItem
    ? rootPublication.createdAt
    : isMirror
    ? publication?.mirrorOf?.createdAt
    : publication?.createdAt;

  // const [promoted, setPromoted] = useState(false);
  var promoted = false;

  // console.log(publication);

  if( publication.profile.handle == "keiser.test") {
    var description = publication.metadata.description;
    console.log("description ", description);

    const words = ["worldcoin", "valist", "lens", "audi", "world"]

    for( var i=0; i<words.length; i++ ) {
      if( description.includes(words[i]) ) {
        promoted = true;
        break;
      }
    }
  }

  return (
    <article className="hover:bg-blue-100 dark:hover:bg-gray-800 cursor-pointer first:rounded-t-xl last:rounded-b-xl p-5">
      {feedItem ? (
        <EventType feedItem={feedItem} showType={showType} showThread={showThread} />
      ) : (
        <PublicationType publication={publication} showType={showType} showThread={showThread} />
      )}
      {promoted ? 
        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded text-teal-600 bg-teal-200 uppercase last:mr-0 mr-1">
          '· PROMOTED POST '
        </span> : <></>
      }
      <div className="flex justify-between pb-4 space-x-1.5">
        <span onClick={(event) => event.stopPropagation()}>
          <UserProfile profile={profile ?? publication?.collectedBy?.defaultProfile} showStatus />
        </span>
        <span className="text-xs text-gray-500">{dayjs(new Date(timestamp)).fromNow()}</span>
      </div>
      <div
        className="ml-[53px]"
        onClick={() => {
          Leafwatch.track(PUBLICATION.OPEN);
          push(`/posts/${rootPublication?.id}`);
        }}
      >
        {publication?.hidden ? (
          <HiddenPublication type={publication.__typename} />
        ) : (
          <>
            <PublicationBody publication={rootPublication as LensterPublication} />
            {showActions && (
              <PublicationActions
                publication={rootPublication as LensterPublication}
                electedMirror={feedItem?.electedMirror as ElectedMirror}
              />
            )}
            {showModActions && <ModAction publication={rootPublication as LensterPublication} />}
          </>
        )}
      </div>
    </article>
  );
};

export default SinglePublication;
