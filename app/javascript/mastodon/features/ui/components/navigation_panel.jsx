import PropTypes from 'prop-types';
import { Component } from 'react';

import { defineMessages, injectIntl } from 'react-intl';
import { Link, withRouter } from 'react-router-dom';
import { WordmarkLogo } from 'mastodon/components/logo';
import NavigationPortal from 'mastodon/components/navigation_portal';
import { timelinePreview, showTrends } from 'mastodon/initial_state';

import ColumnLink from './column_link';
import DisabledAccountBanner from './disabled_account_banner';
import FollowRequestsColumnLink from './follow_requests_column_link';
import ListPanel from './list_panel';
import NotificationsCounterIcon from './notifications_counter_icon';
import SignInBanner from './sign_in_banner';
import { Icon } from 'mastodon/components/icon';

const messages = defineMessages({
  home: { id: 'tabs_bar.home', defaultMessage: 'Home' },
  notifications: { id: 'tabs_bar.notifications', defaultMessage: 'Notifications' },
  explore: { id: 'explore.title', defaultMessage: 'Explore' },
  firehose: { id: 'column.firehose', defaultMessage: 'Live feeds' },
  direct: { id: 'navigation_bar.direct', defaultMessage: 'Private mentions' },
  favourites: { id: 'navigation_bar.favourites', defaultMessage: 'Favourites' },
  bookmarks: { id: 'navigation_bar.bookmarks', defaultMessage: 'Bookmarks' },
  lists: { id: 'navigation_bar.lists', defaultMessage: 'Lists' },
  preferences: { id: 'navigation_bar.preferences', defaultMessage: 'Preferences' },
  followsAndFollowers: { id: 'navigation_bar.follows_and_followers', defaultMessage: 'Follows and followers' },
  about: { id: 'navigation_bar.about', defaultMessage: 'About' },
  search: { id: 'navigation_bar.search', defaultMessage: 'Search' },
  gettingStarted: { id: 'getting_started.heading', defaultMessage: 'Getting started' },
  publish: { id: 'compose_form.publish', defaultMessage: 'Publish' },
});

class NavigationPanel extends Component {

  static contextTypes = {
    router: PropTypes.object.isRequired,
    identity: PropTypes.object.isRequired,
  };

  static propTypes = {
    intl: PropTypes.object.isRequired,
    location: PropTypes.object,
  };

  isFirehoseActive = (match, location) => {
    return match || location.pathname.startsWith('/public');
  };

  render () {
    const { intl, location } = this.props;
    const { signedIn, disabledAccountId } = this.context.identity;

    return (
      <div className='navigation-panel'>
        <div className='navigation-panel__logo'>
          <Link to='/' className='column-link column-link--logo'><WordmarkLogo /></Link>
          <hr />
        </div>

        {signedIn && (
          <>
            <ColumnLink transparent to='/home' icon='home' text={intl.formatMessage(messages.home)} />
            <ColumnLink transparent to='/notifications' icon={<NotificationsCounterIcon className='column-link__icon' />} text={intl.formatMessage(messages.notifications)} />
            <FollowRequestsColumnLink />
          </>
        )}

        {showTrends ? (
          <ColumnLink transparent to='/explore' icon='hashtag' text={intl.formatMessage(messages.explore)} />
        ) : (
          <ColumnLink transparent to='/search' icon='search' text={intl.formatMessage(messages.search)} />
        )}

        {(signedIn || timelinePreview) && (
          <ColumnLink transparent to='/public/local' isActive={this.isFirehoseActive} icon='globe' text={intl.formatMessage(messages.firehose)} />
        )}

        {!signedIn && (
          <div className='navigation-panel__sign-in-banner'>
            <hr />
            { disabledAccountId ? <DisabledAccountBanner /> : <SignInBanner /> }
          </div>
        )}

        {signedIn && (
          <>
            <ColumnLink transparent to='/conversations' icon='at' text={intl.formatMessage(messages.direct)} />
            <ColumnLink transparent to='/bookmarks' icon='bookmark' text={intl.formatMessage(messages.bookmarks)} />
            <ColumnLink transparent to='/favourites' icon='star' text={intl.formatMessage(messages.favourites)} />
            <ColumnLink transparent to='/lists' icon='list-ul' text={intl.formatMessage(messages.lists)} />

            <ListPanel />

            <hr />

            <ColumnLink transparent href='/settings/preferences' icon='cog' text={intl.formatMessage(messages.preferences)} />
          </>
        )}

        <div className='navigation-panel__legal'>
          <hr />
          <ColumnLink transparent to='/about' icon='ellipsis-h' text={intl.formatMessage(messages.about)} />
        </div>

        {signedIn && (
          <ColumnLink transparent to='/getting-started' icon='bars' text={intl.formatMessage(messages.gettingStarted)} />
        )}

        {signedIn && location.pathname !== '/publish' && (
          <Link to='/publish' className='floating-action-button' aria-label={intl.formatMessage(messages.publish)}>
            <Icon id='pencil' />
          </Link>
        )}

        <NavigationPortal />
      </div>
    );
  }

}

export default injectIntl(withRouter(NavigationPanel));
