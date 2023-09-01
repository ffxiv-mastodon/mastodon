# frozen_string_literal: true

class PublicStatusesIndex < Chewy::Index
  settings index: index_preset(refresh_interval: '30s', number_of_shards: 5), analysis: {
    filter: {
      english_stemmer: {
        type: 'stemmer',
        language: 'english',
      },

      english_possessive_stemmer: {
        type: 'stemmer',
        language: 'possessive_english',
      },
    },

    tokenizer: {
      ja_tokenizer: {
        type: 'kuromoji_tokenizer',
        mode: 'search',
        user_dictionary: 'userdict_ja.txt',
      },
    },

    analyzer: {
      content: {
        tokenizer: 'ja_tokenizer',
        type: 'custom',
        char_filter: %w(
          icu_normalizer
        ),
        filter: %w(
          kuromoji_stemmer
          kuromoji_part_of_speech
          english_possessive_stemmer
          lowercase
          asciifolding
          cjk_width
          elision
          english_stemmer
        ),
      },

      ja_default_analyzer: {
        tokenizer: 'kuromoji_tokenizer',
      },
    },
  }

  index_scope ::Status.unscoped
                      .kept
                      .indexable
                      .includes(:media_attachments, :preloadable_poll, :preview_cards)

  root date_detection: false do
    field(:id, type: 'long')
    field(:account_id, type: 'long')
    field(:text, type: 'text', analyzer: 'ja_default_analyzer', value: ->(status) { status.searchable_text }) { field(:stemmed, type: 'text', analyzer: 'content') }
    field(:language, type: 'keyword')
    field(:properties, type: 'keyword', value: ->(status) { status.searchable_properties })
    field(:created_at, type: 'date', value: ->(status) { status.created_at })
  end
end
